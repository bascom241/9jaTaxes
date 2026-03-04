
import { Sparkles, MessageSquare  , TrendingUp,  Radar, BookOpen, Shield} from 'lucide-react';
const Why = () => {



    const boxes = [
        {
            icon: <MessageSquare  color='white'/>,
            title: "Ai-Powered Tax-Bot",
            content: "Get instant answers to your tax questions in plain English (or Pidgin!). Understand tax obligations, deductions, and compliance—simplified"
        },
        {
            icon: <Sparkles color='white'/>,
            title: "Grants & Opportunities",
            content: "Discover relevant grants, hackathons, competitions, and funding opportunities curated specifically for Nigerian entrepreneurs and creatives."
        },
        {
            icon: <TrendingUp  color='white'/>,
            title: "Policy Updates",
            content: "Stay informed with real-time updates on business policies, regulations, and government announcements that impact your growth."
        },
        {
            icon: < Radar color='white'/>,
            title: "Expansion & Relocation Insights",
            content: "Get guidance on expanding your business to new markets or relocating operations with policy insights and regulatory requirements."
        },

        {
            icon: <BookOpen color='white'/>,
            title: "Business Resources",
            content: "Access curated resources, guides, and tools designed to help you navigate business registration, compliance, and growth strategies."
        },
        {
            icon: <Shield color='white'/>,
            title: "Tailored for You",
            content: "Built by Nigerians, for Nigerians. We speak your language and understand the unique challenges of building in Nigeria."
        },

    ]



    return (
        <main className="flex flex-col gap-4 items-center">
            <section className="flex flex-col gap-4">
                <h1 className="text-white text-4xl font-semibold text-center">Why <span className="text-green-400">9jataxes?</span></h1>

                <div>
                    <p className="text-center text-gray-300 text-xl">We help you make informed business decisions and make strategies that support </p>
                    <p className="text-center text-gray-300 text-xl">business growth</p>
                </div>

            </section>


            <section className='grid grid-cols-3 gap-4 px-14 '>


                {
                    boxes.map((b: any) => (
                        <div className='bg-[#1b2e42] flex flex-col gap-2 rounded-2xl border border-gray-400 px-4 py-8  justify-center'>
                            <span className='bg-green-500 w-[15%]  mb-6 p-4 flex items-center justify-center rounded-2xl'>
                                {b.icon}
                            </span>
                            <p className='text-2xl  font-semibold text-gray-100'> {b.title}</p>
                            <p className='text-gray-300 text-[18px]'>{b.content}</p>
                        </div>
                    ))
                }

            </section>
        </main>
    )
}

export default Why
