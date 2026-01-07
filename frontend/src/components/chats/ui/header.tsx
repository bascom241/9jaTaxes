
import bot from "../../../assets/bot.png"
const Header = () => {
    return (
        <header className="flex flex-col items-center justify-center gap-2">
            <img
                src={bot}
                className="w-32 h-32"
            />

            <p className="text-5xl">Chat with <span className="text-green-700 text-5xl">TaxBot</span></p>
            <p className="text-xl">Your AI assistant for understanding Nigerian taxes</p>
        </header>
    )
}

export default Header
