import React from 'react';

export default function MoodboardsSection({ moodboards = [], heading = 'Moodboards' }) {
  return (
    <div className="py-6">
      <div className="px-2 sm:px-4 lg:px-6">      
        <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-gray-900 mb-8">
          {heading}
        </h2>       
        <div className="flex flex-col md:flex-row md:items-stretch gap-3">         
          {moodboards[0] && (
            <div className="w-full md:w-[40%] rounded-xl overflow-hidden shadow-md hover:shadow-lg relative">
              <div className="h-64 md:h-[510px] w-full relative">
                <img src={moodboards[0].image} alt={moodboards[0].title} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="text-white">
                    {moodboards[0].category && (
                      <p className="text-sm mb-1 flex items-center gap-2 text-stone-300">
                        {moodboards[0].category.split(' • ').map((cat, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <span className="w-1 h-1 bg-white rounded-full"></span>}
                            <span>{cat}</span>
                          </React.Fragment>
                        ))}
                      </p>
                    )}
                    <h3 className="md:text-xl text-lg font-black">{moodboards[0].title}</h3>
                  </div>
                </div>
              </div>
            </div>
          )}        
                <div className="w-full md:w-[30%] flex flex-col gap-3">
            {moodboards.slice(1, 3).map((m, i) => (
              <div key={i} className="flex-1 rounded-3xl overflow-hidden shadow-md hover:shadow-lg relative">
                    <div className="h-48 md:h-[247px] w-full relative">
                      <img
                        src={m.image}
                        alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover transform-gpu transition-transform duration-300 hover:scale-105 active:scale-105 cursor-zoom-in"
                      />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
