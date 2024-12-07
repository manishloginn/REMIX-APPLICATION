import React from 'react'
import '../style/home.css'
import { Link } from '@remix-run/react'

const home = () => {
    return (
        <>
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
                            <Link to='/Quiz'>  Student</Link>
                        </button>
                        <button id="Start_solving" className="btnnnnn ml-3">
                            <Link to='/admin'>Admin</Link>
                        </button>
                    </div>
                </div>
            </section>
        </>

    )
}

export default home

