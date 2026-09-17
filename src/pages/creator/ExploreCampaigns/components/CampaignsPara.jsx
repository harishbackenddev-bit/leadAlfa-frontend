export default function CampaignsPara({ sections = [] }) {
  return (
    <div className="bg-white py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                {section.title}
              </h2>
              {section.content && (
                <p className="text-gray-700 leading-loose text-xs md:text-sm mb-4">
                  {section.content}
                </p>
              )}
              {section.list && section.list.length > 0 && (
                <ul className="list-disc leading-relaxed list-inside space-y-2 text-gray-700 text-xs md:text-sm mb-4">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
              {section.note && (
                <p className="text-gray-600 md:text-sm text-xs mt-4">
                  {section.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
