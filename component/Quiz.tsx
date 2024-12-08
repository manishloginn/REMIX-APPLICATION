import React, { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";

import { LoaderFunction, json } from "@remix-run/node";
import { ActionFunction, redirect } from "@remix-run/node";
import { getDb } from "~/db.server";
// import { getDb } from "~/db.server";

export const loader: LoaderFunction = async () => {
    try {
        const db = await getDb();
        if (!db) {
            console.error("Database connection not established");
          }          
        const quizQuestions = await db.collection("quizQuestions").find().toArray();

        if (!quizQuestions || quizQuestions.length === 0) {
            console.warn("No quiz questions found in the database.");
        }

        // console.log(quizQuestions)
        return json({ quizQuestions });
    } catch (error) {
        console.error("Error loading quiz questions:", error);
        throw new Response("Failed to load quiz questions", { status: 500 });
    }
};

export const action: ActionFunction = async ({ request }) => {
    try {
      const formData = await request.formData();
      const question = formData.get("question");
      const options = [
        formData.get("option1"),
        formData.get("option2"),
        formData.get("option3"),
        formData.get("option4"),
      ];
      const correctAnswer = formData.get("correctAnswer");
  
      if (!question || !correctAnswer || options.some((o) => !o)) {
        return json({ error: "All fields are required" }, { status: 400 });
      }
  
      const db = await getDb();
    //   const result = await db.collection("quizQuestions").insertOne({
    //     question,
    //     options,
    //     correctAnswer,
    //   });
  
    //   console.log("Question saved successfully:", result.insertedId);
      return json({ success: "Question added successfully" });
    } catch (error) {
      console.error("Failed to save question:", error);
      return json({ error: "Failed to save question" }, { status: 500 });
    }
  };
  

interface QuestionData {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface AttemptedQuestion {
    questionIndex: number;
    selectedOption: string;
    correctAnswer: string;
    isCorrect: boolean;
}

const Quiz = () => {
    const { quizQuestions }: { quizQuestions: QuestionData[] } = useLoaderData();
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [score, setScore] = useState<number>(0);
    const [answered, setAnswered] = useState<boolean>(false);
    const [attemptedQuestions, setAttemptedQuestions] = useState<AttemptedQuestion[]>([]);
    const [timeLeft, setTimeLeft] = useState(60);

    const handleNextQuestion = () => {
        if (questionIndex < quizQuestions.length - 1) {
            setSelectedOption("");
            setAnswered(false);
            setQuestionIndex(questionIndex + 1);
            setTimeLeft(60);
        } else {
            alert(`Quiz completed! Your Score is ${score} `);
        }
    };

    const handlePreviousQuestion = () => {
        if (questionIndex > 0) {
            setSelectedOption("");
            setAnswered(false);
            setQuestionIndex(questionIndex - 1);
        }
        setTimeLeft(60);
    };

    const checkAnswer = () => {
        const correctAnswer = quizQuestions[questionIndex].correctAnswer;
        if (!selectedOption) {
            return alert("Please select an option");
        }

        if (correctAnswer === selectedOption) {
            setScore((prevScore) => prevScore + 5);
        }

        setAnswered(true);
        setAttemptedQuestions((prev) => [
            ...prev,
            { questionIndex, selectedOption, correctAnswer, isCorrect: correctAnswer === selectedOption },
        ]);

        setTimeout(handleNextQuestion, 1000);
    };

    const getAttemptedQuestionStatus = (index: number): AttemptedQuestion | undefined => {
        return attemptedQuestions.find((q) => q.questionIndex === index);
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            alert("Time is up!");
            setTimeLeft(60);
            handleNextQuestion();
        }
    }, [timeLeft]);

    if (!quizQuestions || quizQuestions.length === 0) {
        return (
            <div className="p-6 max-w-lg mx-auto">
                <h2 className="text-xl font-bold text-red-500">
                    No quiz questions available. Please try again later.
                </h2>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-lg mx-auto">
            <div className="flex justify-between">
                <div>
                    <span className={`material-icons cursor-pointer ${questionIndex === 0 ? 'text-gray-400' : ''}`}
                        onClick={handlePreviousQuestion} >
                        arrow_back
                    </span>
                    <span className={`material-icons cursor-pointer ${questionIndex === quizQuestions.length - 1 ? 'text-gray-400' : ''}`}
                        onClick={handleNextQuestion} >
                        arrow_forward
                    </span>

                </div>
                <div>
                    <span>{questionIndex + 1}</span>/<span>{quizQuestions.length}</span>
                </div>
                <div>{timeLeft}</div>
            </div>
            <div className="mb-6">
                <h2 className="text-xl font-bold">
                    Q{questionIndex + 1}: {quizQuestions[questionIndex].question}
                </h2>
            </div>
            <ul className="grid grid-cols-2 gap-4">
                {quizQuestions[questionIndex].options.map((option, index) => {
                    const attemptedStatus = getAttemptedQuestionStatus(questionIndex);
                    const isCorrect = attemptedStatus && attemptedStatus.correctAnswer === option;
                    const isSelected = attemptedStatus && attemptedStatus.selectedOption === option;

                    return (
                        <div key={index} className="flex align-baseline justify-center text-center">
                            <input
                                type="radio"
                                name="options"
                                value={option}
                                id={`option-${index}`}
                                checked={isSelected}
                                onChange={() => setSelectedOption(option)}
                                className="peer sr-only"
                                disabled={answered}
                            />
                            <label
                                htmlFor={`option-${index}`}
                                className={`cursor-pointer flex justify-center items-center block p-4 border rounded-lg bg-gray-100
            min-h-[200px] min-w-[200px]
            ${isSelected ? "bg-blue-900 text-white" : ""}
            ${answered && option === quizQuestions[questionIndex].correctAnswer ? "bg-green-500 text-white" : ""}
            ${answered && option === selectedOption && option !== quizQuestions[questionIndex].correctAnswer ? "bg-red-700 text-white" : ""}
            peer-checked:bg-blue-900 peer-checked:text-white
            peer-checked:transition-colors peer-checked:duration-200
          `}
                                role="button"
                                tabIndex={0}
                            >
                                {option}
                            </label>
                        </div>
                    );
                })}
            </ul>

            <button
                className="bg-red-600 text-white px-6 py-3 rounded-lg mt-6"
                onClick={checkAnswer}
                disabled={answered}
            >
                Check Answer
            </button>
            <div>Your score: {score}</div>

            {
                attemptedQuestions.length > 0 ? (
                    <div className="mt-4">
                        <h3 className="text-lg font-bold">Previous Attempts</h3>
                        {attemptedQuestions.map((attempt, idx) => (
                            <div key={idx} className={`p-2 mt-4 rounded ${attempt.isCorrect ? "bg-green-200" : "bg-red-200"}`}>
                                <p>Q{attempt.questionIndex + 1}: {quizQuestions[attempt.questionIndex].question}</p>
                                <p>Your Answer: {attempt.selectedOption}</p>
                                <p>Correct Answer: {attempt.correctAnswer}</p>
                            </div>
                        ))}
                    </div>
                ) : ('')
            }

        </div>
    );
};

export default Quiz;
