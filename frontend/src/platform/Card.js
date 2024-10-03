import { usePages } from "../ContextProvider";
import PlasmidPage from '../workspace/PlasmidPage';
import { v4 as uuidv4 } from 'uuid';

function Card({type, title, imageUrl, bulletPoints, objectData }) {
    
  const { addPage } = usePages();

  const handleClick = () => {
    if (type === "plasmid") {
      addPage({
        key: `page__${uuidv4()}`,
        title: title,
        content: (
          <PlasmidPage results={objectData} />
        )
      });
    }
  };

  return (
    <div
      className="bg-gray-200 rounded-lg shadow p-4 cursor-pointer"
      onClick={handleClick}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{type}</h3>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <img src={imageUrl} alt={title} className="w-full h-40 object-cover rounded-md mb-2" />
      <ul className="text-sm text-gray-700">
        {bulletPoints.map((point, index) => (
          <li key={index} className="list-disc ml-4 mb-1">
            {point}
          </li>
        ))}
      </ul>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{JSON.stringify(objectData)}</h3>
    </div>
  );
}

export default Card;