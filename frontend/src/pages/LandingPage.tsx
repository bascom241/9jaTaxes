
import Hero from "../components/home/Hero"
import Why from "../components/home/Why"
import Subscribe from "../components/home/subscribe"
import PerfectFor from "../components/home/PerfectFor"
const LandingPage = () => {
    return (
        <main className="mt-16 bg-[#213448] w-full h-full">
            <Hero />
            <Why />
            <PerfectFor/>
            <Subscribe/>
        </main>
    )
}

export default LandingPage
