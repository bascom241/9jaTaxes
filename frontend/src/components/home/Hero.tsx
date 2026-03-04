

import { Sparkles } from 'lucide-react';
const Hero = () => {
    return (
        <main className="py-12 flex w-full h-screen flex-col items-center gap-4">
            <section>
                <button className="bg-[#08464a] border-green-400 border rounded-full gap-4 px-4 py-2 flex items-between">
                    <Sparkles color='green' />
                    <p className="text-green-400">Launching soon</p>
                </button>
            </section>

            <section className='mt-3'>
                <h1 className='text-white text-6xl'>Grow Your Bussiness with <span className='text-green-400'>Policy</span></h1>
                <h1 className='text-green-400 text-6xl text-center mt-4'>Insights <span className='text-white'>and</span> Oppotunities</h1>
            </section>

            <section className='mt-6'>
                    <p className='text-white text-2xl'>Discover grants, hackathons, and policy information that support your expansion,</p>
                    <p className='text-white text-2xl text-center' >relocation, and business growth</p>
            </section>

            <section className='mt-4 flex gap-4 '>
                <button className=" bg-green-400 border-green-400 border rounded-full gap-4 px-6 py-3 flex items-between">
                    <Sparkles color='white' />
                    <p className="text-white">Join the Waitlist</p>
                </button>

                <button className=" border-[#060d13] bg-[#1a2a3b5f]  border rounded-full gap-4 px-14 py-3 flex items-between ">
               
                    <p className=" text-white ">Get Started</p>
                </button>

            
            </section>

                <p className='text-white mt-3'>🇳🇬 Built specifically for Nigerian youth aged 17-35</p>
        </main>
    )
}

export default Hero
