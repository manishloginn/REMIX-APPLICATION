import React, { useEffect, useState } from 'react';

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

const questionData: QuestionData[] = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris",
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
    },
    {
        question: "What is the largest mammal on Earth?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Shark"],
        correctAnswer: "Blue Whale",
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Osmium", "Ozone", "Oganesson"],
        correctAnswer: "Oxygen",
    },
    {
        question: "Which country is the largest by land area?",
        options: ["Canada", "Russia", "China", "United States"],
        correctAnswer: "Russia",
    },
];

const Quiz = () => {
    const [questionIndex, setQuestionIndex] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<string>(""); // Track selected option
    const [score, setScore] = useState<number>(0); // Score state
    const [answered, setAnswered] = useState<boolean>(false); // Track if the question is answered
    const [attemptedQuestions, setAttemptedQuestions] = useState<AttemptedQuestion[]>([]); // To track attempted questions
    const [timeLeft, setTimeLeft] = useState(60); // Timer for each question

    const handleNextQuestion = () => {
        if (questionIndex < questionData.length - 1) {
            setSelectedOption(""); // Reset selected option for next question
            setAnswered(false); // Reset answer status for next question
            setQuestionIndex(questionIndex + 1);
            setTimeLeft(60); // Reset timer for next question
        } else {
            alert("You have completed the quiz!");
        }
    };

    const handlePreviousQuestion = () => {
        if (questionIndex > 0) {
            setSelectedOption(""); // Reset selected option when going back
            setAnswered(false); // Reset answer status for previous question
            setQuestionIndex(questionIndex - 1);
        }
        setTimeLeft(60); // Reset timer for previous question
    };

    const checkAnswer = () => {
        const correctAnswer = questionData[questionIndex].correctAnswer;
        if (!selectedOption) {
            return alert('Please select an option');
        }

        // Check if the selected answer is correct and update score
        if (correctAnswer === selectedOption) {
            setScore(prevScore => prevScore + 5); // Increase score for correct answer
        }

        // Mark the question as answered, regardless of correct or incorrect answer
        setAnswered(true);

        // Update the attempted questions list
        setAttemptedQuestions(prev => [
            ...prev,
            { questionIndex, selectedOption, correctAnswer, isCorrect: correctAnswer === selectedOption },
        ]);

        // Move to next question after answering
        setTimeout(handleNextQuestion, 1000); // Wait for 1 second before moving to next question
    };

    // Function to get the status of the question (answered or not)
    const getAttemptedQuestionStatus = (index: number): AttemptedQuestion | undefined => {
        return attemptedQuestions.find(q => q.questionIndex === index);
    };

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            alert('Time is up!');
            setTimeLeft(60); // Reset the timer
            handleNextQuestion(); // Move to the next question after time is up
        }
    }, [timeLeft]);

    return (
        <div className="p-6 max-w-lg mx-auto">
            <div className='flex justify-between'>
                <div className="w-100 flex justify-between">
                    <span
                        onClick={handlePreviousQuestion}
                        className={`material-icons cursor-pointer ${questionIndex === 0 ? 'text-gray-400' : ''}`}
                    >
                        arrow_back
                    </span>

                    <span
                        onClick={handleNextQuestion}
                        className={`material-icons cursor-pointer ${questionIndex === questionData.length - 1 ? 'text-gray-400' : ''}`}
                    >
                        arrow_forward
                    </span>
                </div>
                <div>
                    <span>{questionIndex + 1}</span>/<span>{questionData.length}</span>
                </div>
                <div>
                    <span>{timeLeft}</span>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-bold">
                    Q{questionIndex + 1}: {questionData[questionIndex].question}
                </h2>
            </div>
            <ul className="grid grid-cols-2 gap-4">
                {questionData[questionIndex].options.map((option, optionIndex) => {
                    const attemptedStatus = getAttemptedQuestionStatus(questionIndex);
                    const isCorrect = attemptedStatus && attemptedStatus.correctAnswer === option;
                    const isSelected = attemptedStatus && attemptedStatus.selectedOption === option;

                    return (
                        <li key={optionIndex}>
                            <input
                                type="radio"
                                name="option"
                                value={option}
                                id={`option-${optionIndex}`}
                                checked={selectedOption === option}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className="peer sr-only"
                                disabled={attemptedStatus} // Disable options for attempted questions
                            />
                            <label
                                htmlFor={`option-${optionIndex}`}
                                className={`cursor-pointer px-4 py-2 rounded bg-gray-100
                                
                                    ${selectedOption === option ? 'bg-blue-900' : ''}
                                    ${answered && option === questionData[questionIndex].correctAnswer ? "bg-green-500" : ""}
                                    ${answered && option === selectedOption && option !== questionData[questionIndex].correctAnswer ? "bg-red-700" : ""}
                                    ${isSelected ? "bg-blue-200" : ""}
                                    ${isCorrect && !isSelected ? "bg-green-500" : ""}
                                `}
                                style={{
                                    height: '200px',  // Set height to 500px
                                    width: '100%',   // Adjust width as needed
                                    display: 'flex', // Allow flex to adjust content inside label
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {option}
                            </label>
                        </li>
                    );
                })}
            </ul>
            <button
                onClick={checkAnswer}
                className='bg-red-600 border-none outline-none text-white px-5 py-3 mt-10 rounded-3xl'
                disabled={answered} // Disable the check button if the question is already answered
            >
                Check your answer
            </button>
            <div className="mt-6">
                <p>Your score: {score}</p> {/* Display score */}
            </div>
        </div>
    );
};

export default Quiz;
