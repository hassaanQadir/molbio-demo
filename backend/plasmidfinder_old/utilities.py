from haoma.utils.logging_config import configure_logger
logger = configure_logger(__name__)
from decouple import config

# metapub NCBI logic

from metapub import FindIt, CrossRefFetcher
from metapub.pubmedcentral import get_pmid_for_otherid
import re


def classify_input(input_string):
    pattern = r'^(?:(\d+)$|([^/]+/[^/]+)$|(.+))$'
    match = re.match(pattern, input_string)
    if match:
        if match.group(1):
            return "PMID"
        elif match.group(2):
            return "DOI"
        else:
            return "Other"
    return "Invalid input"
    
def article_to_doi(input_string):
  """Take the name of a paper and return the DOI if possible."""
  CR = CrossRefFetcher()       # starts the query cache engine
  work = CR.article_by_title(input_string)
  if work is not None:
    return work.doi


def pmid_to_pdf_url(pmid):
  """Take the PMID of a paper and return a link to it's pdf if possible."""
  logger.debug(f"attempting to find paper with PMID: {pmid}" )
  try:
    src = FindIt(pmid)
  except:
    return "No URL found"
  if src.url is None:
      logger.debug(src.reason)
      return src.reason
  else:
      logger.debug(src.url)
      return src.url

def user_input_to_pdf_url(input_string):
   # classify the input
    classification = classify_input(input_string)
    if classification == "PMID":
      return pmid_to_pdf_url(input_string)
    if classification == "DOI":
      PMID = get_pmid_for_otherid(input_string)
      return pmid_to_pdf_url(PMID)
    if classification == "Other":
      DOI = article_to_doi(input_string)
      PMID = get_pmid_for_otherid(DOI)
      return pmid_to_pdf_url(PMID)
    else:
      return "Invalid input"

# pdf handling logic

import requests
import fitz  # PyMuPDF
from io import BytesIO

def is_valid_url(url):
    """Check if the URL is valid by attempting a GET request with limited download."""
    try:
        with requests.get(url, stream=True) as response:
            # Check if the request was successful
            return response.status_code == 200
    except requests.RequestException:
        return False

def download_pdf(url):
    """Download a PDF from a given URL and return a BytesIO object."""
    try:
        logger.debug(f"Attempting to download PDF from {url}")
        response = requests.get(url)
        response.raise_for_status()  # Will raise an HTTPError if the HTTP request returned an unsuccessful status code.
        return BytesIO(response.content)
    except requests.RequestException as e:
        logger.debug(f"Failed to download PDF from {url}: {e}")
        return None

def extract_text_from_pdf(pdf_io):
    """Extract text from a PDF BytesIO object using PyMuPDF."""
    if pdf_io is None:
        return "Error: PDF content is not available."
    try:
        text = ""
        with fitz.open("pdf", pdf_io) as doc:
            for page in doc:
                text += page.get_text() + "\n"
        return text
    except RuntimeError as e:
        logger.debug(f"Failed to extract text from PDF: {e}")
        return "Error: Failed to extract text from PDF."

def download_and_extract_text_from_pdf(pdf_url):
    """Download a PDF from a given URL and extract its text using PyMuPDF."""
    if not is_valid_url(pdf_url):
        logger.debug(f"Invalid URL: {pdf_url}")
        return "Error: Invalid URL."
    pdf_io = download_pdf(pdf_url)
    if pdf_io is None:
        return "Error: PDF download failed."
    pdf_text = extract_text_from_pdf(pdf_io)
    logger.debug("PDF downloaded and text extracted successfully.")
    return pdf_text

def get_paper_text(user_input):
    # Takes user_input, gets the link to the pdf, downloads and extracts texts
    # and checks if we got an error indicating the URL was resistant to scraping.
    pdf_url = user_input_to_pdf_url(user_input)
    if pdf_url is None or not pdf_url.startswith(('http://', 'https://')):
        logger.error("The URL provided is invalid or None.")
        return "Error: The provided input did not result in a valid URL."
    paper_text = download_and_extract_text_from_pdf(pdf_url)
    return paper_text


# Addgene navigation logic

from bs4 import BeautifulSoup # type: ignore
import requests
import re
from Bio import SeqIO
import os

def parse_addgene_sequences_page(url):

  # Check if the URL contains a sequence ID
  if re.search(r'/\d{5}/$', url):
    url = url + "sequences/"
  elif re.search(r'/\d{5}$', url):
    url = url + "/sequences/"
  else:
    return None

  # Send a GET request to the URL
  html_content = requests.get(url).text

  soup = BeautifulSoup(html_content, 'html.parser')

  # Try to Navigate to <section id="addgene-full">
  section = soup.find('section', id='addgene-full')

  # Otherwise Navigate to <section id="depositor-full">
  if not section:
    section = soup.find('section', id='depositor-full')

  if section:
      # Navigate to <ul class="list-unstyled addgene-sequence-list">
      ul = section.find('ul', class_='list-unstyled addgene-sequence-list')
      if ul:
          # Find the first <a> tag with class "genbank-file-download" and get the href
          a_tag = ul.find('a', class_='genbank-file-download')
          if a_tag and a_tag.has_attr('href'):
              href = a_tag['href']
              print(href)
              return href
          else:
              print("Link not found.")
      else:
          print("List not found.")
  else:
      print("Section not found.")

def download_file(href):
  if not href:
    return None

  # Send a GET request to the href
  response = requests.get(href)

 
# Check if the request was successful
  if response.status_code == 200:
        # Define the directory and file paths
        directory = "session_data"
        file_path = os.path.join(directory, "downloaded_file.gbk")

        # Check if the directory exists, if not, create it
        if not os.path.exists(directory):
            os.makedirs(directory)

        # Open a file in binary write mode
        with open(file_path, "wb") as file:
            file.write(response.content)
        logger.debug("Genbank File downloaded successfully.")
        return file_path
  else:
        print(f"Failed to download file. Status code: {response.status_code}")
        return None

def display_genbank_file(genbank_file_location):
    if not genbank_file_location:
      return None

  # Read the GenBank file and display its contents
    for seq_record in SeqIO.parse(genbank_file_location, "genbank"):
      genbank_for_display = (f"Full record: {seq_record}\n" + f"Sequence: {seq_record.seq}\n")
      return genbank_for_display

#LLM Logic

# Standard library imports
import time
# Third party imports
import openai
from langchain_openai import ChatOpenAI
from langchain.prompts import  MessagesPlaceholder
from langchain.agents import tool, AgentExecutor
from langchain_core.utils.function_calling import convert_to_openai_function
from langchain.agents.format_scratchpad import format_to_openai_function_messages
from langchain.agents.output_parsers import OpenAIFunctionsAgentOutputParser
from duckduckgo_search import DDGS
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel
from langchain.callbacks import LangChainTracer
from langsmith import Client
import tiktoken


# Get the OpenAI key from environment variables
openai.api_key = config('OPENAI_API_KEY')


callbacks = [
  LangChainTracer(
    project_name="devhassaan.molbio.ai",
    client=Client(
      api_url="https://api.smith.langchain.com",
      api_key="ls__fe35251ea7734ae688dc79ad659e46b3"
    )
  )
]


def num_tokens_from_string(string: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.encoding_for_model("gpt-3.5-turbo")
    num_tokens = len(encoding.encode(string))
    return num_tokens


@tool(return_direct=False)
def duckduckgo_search(query):
    """Performs a web search on DuckDuckGo."""
    results_dict = {}  # Initialize an empty dictionary
    logger.debug(f"Searched the following on DuckDuckGo: {query}")
    with DDGS() as ddgs:
        for idx, r in enumerate(ddgs.text(query, max_results=3)):
            results_dict[f'result_{idx}'] = r  # Add each result to the dictionary with a unique key
    
    return results_dict

@tool(return_direct=True)
def addgene_sequence_downloader(url):
    """Downloads the sequence from Addgene."""
    href = parse_addgene_sequences_page(url)
    logger.debug(f"Downloaded an Addgene genbank from here: {href}")
    genbank_file_location = download_file(href)
    genbank_for_display = display_genbank_file(genbank_file_location)
    return genbank_for_display

def setup_agent(tools, system_prompt, model_name, cut_in_half):
    """Sets up a Langchain agent."""

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_prompt),
            ("user", "{input}"), 
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ]
    )

    llm = ChatOpenAI(model_name = model_name, temperature=0, openai_api_key=openai.api_key)
    llm_with_tools = llm.bind(functions=[convert_to_openai_function(t) for t in tools])
    
    if cut_in_half:
        agent = (
            {
                # Modify this lambda function to use only the first half of the input string
                "input": lambda x: x["input"][:len(x["input"])//2],
                "agent_scratchpad": lambda x: format_to_openai_function_messages(
                    x["intermediate_steps"]
                ),
            }
            | prompt
            | llm_with_tools
            | OpenAIFunctionsAgentOutputParser()
        )
    else:
        agent = (
        {
            "input": lambda x: x["input"],
            "agent_scratchpad": lambda x: format_to_openai_function_messages(
                x["intermediate_steps"]
            ),
        }
        | prompt
        | llm_with_tools
        | OpenAIFunctionsAgentOutputParser()
    )
        
    logger.debug(f"Created agent chain using LCEL with tools: {', '.join(tool.name for tool in tools)}\nsystem prompt: {system_prompt}\nmodel name: {model_name}")

    # return the agent wrapped in an AgentExecutor runtime
    return AgentExecutor(agent=agent, tools=tools, verbose=False, return_intermediate_steps=True)

def plasmidfinder_agent_interpreter(plasmidfinder_agent_response):
    """Interprets the response from the plasmidfinder agent."""
    
    # Initialize the return dictionary with default values
    return_data = {
        "duckduckgo_results_dict": {},
        "addgene_genbank": {},
        "final_output_string": "Output not found"
    }
    
    results = plasmidfinder_agent_response.get("intermediate_steps", [])
    # Update the dictionary based on available data
    if len(results) > 0:
        return_data["duckduckgo_results_dict"] = results[0][1]
    if len(results) > 1:
        return_data["addgene_genbank"] = results[1][1]

    logger.debug("We've collected the intermediate steps")

    # Update the final output string if available
    final_output = plasmidfinder_agent_response.get('output')
    if final_output:
        return_data["final_output_string"] = final_output

    logger.debug(f"final_output_string: {return_data['final_output_string']}")

    return return_data


def driver(pmid):
    paper_text = get_paper_text(pmid)
    num_tokens = num_tokens_from_string(paper_text)
    logger.debug(f"The paper is {num_tokens} tokens long.")

    multiple_agents_results_dictionary = {}

    if num_tokens < 100:
        logger.debug("webscraping error")
        webscraping_fail_results = {
        "duckduckgo_results_dict": {},
        "addgene_genbank": {},
        "final_output_string": "Webscraping error"
        }
        plasmidfinder_agent_results_dictionary = webscraping_fail_results
        methodmaker_agent_results_dictionary = webscraping_fail_results

    else:
        
        plasmidfinder_tools = [duckduckgo_search, addgene_sequence_downloader]
        plasmidfinder_system_prompt = "You are very powerful assistant. Use Duckduckgo to search for the Addgene page for the plasmids used in the given paper. Then follow the link closely matching the format https://www.addgene.org/12345/ and download the Plasmid DNA sequence directly from that Addgene page."
        plasmidfinder_model_name = "gpt-4-1106-preview"
        plasmidfinder_agent_executor = setup_agent(plasmidfinder_tools, plasmidfinder_system_prompt, plasmidfinder_model_name, False)

        methodmaker_tools = [duckduckgo_search, addgene_sequence_downloader]
        methodmaker_system_prompt = "You are very powerful assistant. Read this paper and return the methods section."
        methodmaker_model_name = "gpt-3.5-turbo-0125"
        if num_tokens < 1600:
            methodmaker_agent_executor = setup_agent(methodmaker_tools, methodmaker_system_prompt, methodmaker_model_name, False)
        else:
            methodmaker_agent_executor = setup_agent(methodmaker_tools, methodmaker_system_prompt, methodmaker_model_name, True)

        
        start_time = time.time()
        plasmidfinder_agent_executor.invoke({"input": paper_text}, config={"callbacks": callbacks})
        end_time = time.time()
        plasmidfinder_duration = end_time - start_time

        start_time = time.time()
        methodmaker_agent_executor.invoke({"input": paper_text}, config={"callbacks": callbacks})
        end_time = time.time()
        methodmaker_duration = end_time - start_time

        start_time = time.time()
        multiple_agents_executor = RunnableParallel(plasmidfinder=plasmidfinder_agent_executor, methodmaker=methodmaker_agent_executor)
        multiple_agents_response = multiple_agents_executor.invoke({"input": paper_text}, config={"callbacks": callbacks})
        end_time = time.time()
        multiple_agents_duration = end_time - start_time

        plasmidfinder_agent_results_dictionary = plasmidfinder_agent_interpreter(multiple_agents_response["plasmidfinder"])
        methodmaker_agent_results_dictionary = plasmidfinder_agent_interpreter(multiple_agents_response["methodmaker"])

        logger.debug(f"plasmidfinder_agent_executor Execution time: {plasmidfinder_duration} seconds")
        logger.debug(f"methodmaker_agent_executor Execution time: {methodmaker_duration} seconds")
        logger.debug(f"multiple_agents_executor Execution time: {multiple_agents_duration} seconds")

    multiple_agents_results_dictionary["plasmidfinder_agent_results_dictionary"] = plasmidfinder_agent_results_dictionary
    multiple_agents_results_dictionary["methodmaker_agent_results_dictionary"]=methodmaker_agent_results_dictionary
    
    return multiple_agents_results_dictionary

