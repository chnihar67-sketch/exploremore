import React from 'react';
import { Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const stories = [
    {
      quote:
        'Booking Shridhar Bhat’s areca homestay through Localora introduced us to genuine Malnad hospitality. We woke up to misty hills, ate piping hot Akki Rotti off banana leaves, and explored Kavaledurga Fort without a single tour bus in sight.',
      author: 'Pooja Narayanan',
      role: 'Slow Travel Enthusiast & Nature Photographer',
      location: 'Bengaluru, Karnataka',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'As an independent mountain driver in Nittur, corporate booking apps ignored us. With Localora, trekking groups book our Kodachadri jeep cooperative directly. It transformed our monthly livelihood during monsoon season.',
      author: 'Suresh Naik',
      role: 'President, Kodachadri 4x4 Drivers Guild',
      location: 'Nittur, Hosanagara Taluk',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    },
    {
      quote:
        'Localora AI planned a 3-day itinerary through Agumbe and Sharavathi that balanced rainforest canopy walks with quiet village craft visits. The budget breakdown was spot on and saved us thousands in middleman fees.',
      author: 'Karthik & Deepa Rao',
      role: 'Heritage Travelers',
      location: 'Mysuru, Karnataka',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-20 bg-[#faf7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs font-semibold text-[#2d5a43] tracking-widest uppercase mb-2">
            Voices of the Ghats
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Loved by Travelers &amp; Local Hosts
          </h2>
          <p className="mt-3 text-stone-600 text-sm">
            Read real stories from conscious travelers and the grassroots entrepreneurs who welcome them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div
              key={i}
              className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between"
            >
              <div>
                <Quote className="w-7 h-7 text-[#2d5a43]/30 mb-4" />
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal italic">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={story.avatar}
                  alt={story.author}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                />
                <div>
                  <div className="font-serif font-bold text-sm text-stone-900">{story.author}</div>
                  <div className="text-[11px] text-stone-500">{story.role}</div>
                  <div className="text-[10px] text-[#2d5a43] font-medium">{story.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
