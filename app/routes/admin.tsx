import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useRef } from "react";
import getDb from "~/db.server";
import Question from "~/db.server";
// import { connectToDatabase, Question } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {


    await getDb();
    const formData = await request.formData();

    const question = formData.get("question") as string;
    // console.log(question)
    const options = [
        formData.get("option1") as string,
        formData.get("option2") as string,
        formData.get("option3") as string,
        formData.get("option4") as string,
    ];
    const correctAnswer = formData.get("correctAnswer") as string;

    if (!question || options.some((o) => !o) || !correctAnswer) {
        return json({ error: "All fields are required" }, { status: 400 });
    }

    try {
        const newQuestion = new Question({ question, options, correctAnswer });
        await newQuestion.save();

        return json({ success: "Question added successfully" });
    } catch (error) {
        console.error("Database save error:", error);
        return json({ error: "Failed to save question" }, { status: 500 });
    }
};

export default function AdminPage() {
    const actionData = useActionData();
    const formRef = useRef<HTMLFormElement>(null); // Reference for the form

    // Clear form after successful submission
    if (actionData?.success) {
        formRef.current?.reset(); // Reset the form
    }

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Add a New Question</h1>
            <Form method="post" ref={formRef} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Question</label>
                    <input
                        type="text"
                        name="question"
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Enter the question"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Options</label>
                    {["option1", "option2", "option3", "option4"].map((name, index) => (
                        <input
                            key={index}
                            type="text"
                            name={name}
                            className="w-full px-4 py-2 border rounded mb-2"
                            placeholder={`Option ${index + 1}`}
                        />
                    ))}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Correct Answer</label>
                    <input
                        type="text"
                        name="correctAnswer"
                        className="w-full px-4 py-2 border rounded"
                        placeholder="Enter the correct answer"
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded">
                    Add Question
                </button>
            </Form>
            {actionData?.success && (
                <p className="text-green-600 mt-4">{actionData.success}</p>
            )}
            {actionData?.error && (
                <p className="text-red-600 mt-4">{actionData.error}</p>
            )}
        </div>
    );
}
