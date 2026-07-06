import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="text-gray-800">
      <h1 className="font-bold text-3xl mt-2">home page</h1>
      <p className="mt-3">
        You can find a short introduction of myself in the&nbsp;
        <Link
          to="/about-me"
          className="text-md text-gray-500 hover:text-gray-800"
        >
          about me section
        </Link>
        .
      </p>
      <p>
        Please, don't take anything here too seriously, I'll just post whatever
        is on my mind.
      </p>

      <h2 className="font-bold text-xl mt-4">working on...</h2>
      <h3 className="font-semibold text-lg">math</h3>
      <p>I have some notes from the math lessons I took:</p>
      <ul className="list-disc list-inside ml-4 space-y-1">
        <li>
          <Link to="notes/topology">topology</Link>
        </li>
        <li>
          <Link to="notes/algebra">algebra</Link>
        </li>
      </ul>
      <p>
        Also, I'm creating a website to read all notes I've written to train
        students for math olympiads:&nbsp;
        <Link to="https://servilleta.vercel.app">servilleta</Link>.
      </p>
      <h3 className="font-semibold text-lg">phi</h3>
      <p>
        I like writing all sort of wrong reasonings. You can read them&nbsp;
        <Link to="phi">here</Link>.
      </p>
      <h3 className="font-semibold text-lg">finance</h3>
      <p>
        I'm also reading Luenberger's Investment Science and uploading notes &
        implementation&nbsp;
        <Link to="https://github.com/BrunZo/finance">here</Link>.
      </p>
    </div>
  );
}
