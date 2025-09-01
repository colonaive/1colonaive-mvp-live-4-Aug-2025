import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Target } from 'lucide-react';
import { supabase } from '../supabase';

// Define the structure of a quiz question
interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

// Quiz data (hardcoded for now)
const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "What is colorectal cancer?",
    options: [
      "A type of skin cancer",
      "Cancer that starts in the colon or rectum",
      "A type of lung cancer",
      "A type of brain cancer"
    ],
    correctAnswer: "Cancer that starts in the colon or rectum",
    explanation: "Colorectal cancer (CRC) begins in the colon or rectum, parts of the large intestine. It’s one of the most common cancers worldwide."
  },
  {
    id: 2,
    question: "At what age should most people start screening for colorectal cancer?",
    options: ["30", "45", "60", "75"],
    correctAnswer: "45",
    explanation: "Guidelines recommend starting regular screening at age 45 for average-risk individuals, as early detection significantly improves outcomes."
  },
  {
    id: 3,
    question: "Which of the following is a common symptom of colorectal cancer?",
    options: [
      "Frequent headaches",
      "Changes in bowel habits (e.g., diarrhea or constipation)",
      "Sudden weight gain",
      "Loss of vision"
    ],
    correctAnswer: "Changes in bowel habits (e.g., diarrhea or constipation)",
    explanation: "CRC can grow without symptoms initially, but changes in bowel habits, blood in stool, or abdominal pain are warning signs."
  },
  {
    id: 4,
    question: "Can regular exercise help reduce your risk of colorectal cancer?",
    options: ["Yes", "No"],
    correctAnswer: "Yes",
    explanation: "Regular physical activity, along with a healthy diet rich in vegetables and fruits, can lower your risk of developing CRC."
  },
  {
    id: 5,
    question: "What is a non-invasive screening option for colorectal cancer mentioned in recent research?",
    options: ["MRI scan", "Blood-based test (like ColonAiQ)", "X-ray", "Ultrasound"],
    correctAnswer: "Blood-based test (like ColonAiQ)",
    explanation: "Blood-based tests, such as the Multi-gene Methylation Detection Kit (ColonAiQ), detect CRC via DNA methylation with high sensitivity (89.36%) and are non-invasive alternatives to colonoscopy."
  },
  {
    id: 6,
    question: "Which dietary habit can help reduce your risk of colorectal cancer?",
    options: [
      "Eating a diet high in processed meats and fats",
      "Consuming plenty of vegetables, fruits, and high-fiber foods",
      "Drinking sugary beverages daily",
      "Avoiding all carbohydrates"
    ],
    correctAnswer: "Consuming plenty of vegetables, fruits, and high-fiber foods",
    explanation: "A diet rich in vegetables, fruits, and fiber can help prevent CRC, while high-fat and processed meat diets may increase risk."
  },
  {
    id: 7,
    question: "Which of the following symptoms should prompt you to seek medical help for possible colorectal cancer?",
    options: [
      "Occasional mild headaches",
      "Blood in your stool or rectal bleeding",
      "Temporary loss of appetite",
      "Feeling tired after exercise"
    ],
    correctAnswer: "Blood in your stool or rectal bleeding",
    explanation: "Blood in the stool, even if not visible to the naked eye, can be an early sign of CRC. Other concerning symptoms include unexplained weight loss, anemia, and persistent abdominal pain. Consult a doctor immediately if you experience these."
  },
  {
    id: 8,
    question: "Is a family history of colorectal cancer a risk factor that should lead to earlier screening?",
    options: ["Yes", "No"],
    correctAnswer: "Yes",
    explanation: "Having a parent, sibling, or child with CRC or polyps increases your risk, and you may need to start screening before age 45. Discuss with your doctor."
  },
  {
    id: 9,
    question: "How often should healthy individuals over 50 get screened for colorectal cancer with a faecal immunochemical test (FIT)?",
    options: ["Every 5 years", "Every year", "Every 10 years", "Only once"],
    correctAnswer: "Every year",
    explanation: "For those over 50 without symptoms, an annual FIT is recommended to detect hidden blood in the stool, which can be an early sign of CRC. If positive, further testing like a colonoscopy may be needed."
  },
  {
    id: 10,
    question: "Which lifestyle factor is associated with an increased risk of colorectal cancer?",
    options: [
      "Regular physical activity",
      "Maintaining a healthy weight",
      "Sedentary lifestyle and obesity",
      "Eating a fiber-rich diet"
    ],
    correctAnswer: "Sedentary lifestyle and obesity",
    explanation: "A sedentary lifestyle and obesity are risk factors for CRC. Staying active and maintaining a healthy weight can significantly reduce your risk."
  }
];

const CRCQuiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = answer;
    setAnswers(updatedAnswers);
  };

  // Move to the next question
  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Move to the previous question
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Calculate and save score to Supabase
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    // Calculate score (10 points per correct answer, total 100)
    let correctCount = 0;
    for (let i = 0; i < quizData.length; i++) {
      if (answers[i] === quizData[i].correctAnswer) {
        correctCount++;
      }
    }
    const finalScore = correctCount * 10; // Percentage score (0-100)
    setScore(finalScore);

    try {
      // Get the current logged-in user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setError('User not authenticated. Please log in to save your score.');
        setLoading(false);
        return;
      }

      // Update quiz_score in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ quiz_score: finalScore })
        .eq('id', user.id);

      if (error) {
        setError('Failed to save your score. Please try again.');
        setLoading(false);
        return;
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigate back to dashboard
  const handleReturnToDashboard = () => {
    navigate('/dashboard/champion');
  };

  // Render quiz completion screen
  if (score !== null) {
    return (
      <div className="pt-60 bg-gray-50 min-h-screen">
        <Container className="py-8 md:py-12">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-white shadow rounded-lg border border-gray-200">
              <CardContent className="p-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Quiz Completed!</h1>
                <p className="text-lg text-gray-600 mb-2">Your Score: <span className="font-bold text-blue-600">{score}%</span></p>
                <p className="text-gray-600 mb-6">Thank you for taking the CRC Knowledge Quiz. Early detection saves lives—consider scheduling a screening if you haven’t already.</p>
                <Button onClick={handleReturnToDashboard} className="mt-4">
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
    );
  }

  // Render current question
  const currentQ = quizData[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.length - 1;

  return (
    <div className="pt-60 bg-gray-50 min-h-screen">
      <Container className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Target className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">CRC Knowledge Quiz</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <Card className="bg-white shadow rounded-lg border border-gray-200 mb-6">
            <CardContent className="p-6">
              <p className="text-sm text-gray-500 mb-2">Question {currentQuestion + 1} of {quizData.length}</p>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">{currentQ.question}</h2>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => {
                  const isSelected = answers[currentQuestion] === option;
                  return (
                    <Button
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className="w-full text-left justify-start"
                      onClick={() => handleAnswerSelect(option)}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={isLastQuestion ? handleSubmit : handleNext}
              disabled={loading || !answers[currentQuestion]}
            >
              {isLastQuestion ? (loading ? "Submitting..." : "Submit Quiz") : "Next"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default CRCQuiz;
