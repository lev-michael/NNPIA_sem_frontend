import FadeIn from "../fade-in/FadeIn.js";

function Home() {
    console.log("welcome");
    return <div>
        Welcome home!
        <FadeIn>
            <h1>This will fade in</h1>
        </FadeIn>
        <FadeIn>
            <h1>This will fade in</h1>
        </FadeIn>
        <FadeIn>
            <h1>This will fade in</h1>
        </FadeIn>
        <FadeIn>
            <h1>This will fade in</h1>
        </FadeIn>
        <FadeIn>
            <h1>This will fade in</h1>
        </FadeIn>
    </div>
}

export default Home;