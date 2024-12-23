import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import '../../style/home.css'

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
       <section id="herosection" className="herosection ">
                <div className="hero1">
                    <div className="contentttt">
                        <p className="para1">Learn new concepts for each question</p>
                    </div>
                    <div className="contentttt2">
                        <span className="line"> </span>{" "}
                        <span className="para2">
                            Learn new concepts for each question
                            <p />
                        </span>
                    </div>
                    <div className="mt-5">
                        <button id="Start_solving" className="btnnnnn">
                            <Link to='/user'>  Student</Link>
                        </button>
                        <button id="Start_solving" className="btnnnnn ml-3">
                            <Link to='/admin'>Admin</Link>
                        </button>
                    </div>
                </div>
            </section>
    </div>
  );
}
