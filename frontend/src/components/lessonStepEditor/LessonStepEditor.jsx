// components/LessonStepEditor.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import useAxios from "@utils/useAxios";
import StepTypeSelector from "./StepTypeSelector";
import TextStepEditor from "./TextStepEditor";
import VideoStepEditor from "./VideoStepEditor";
import QuestionStepEditor from "./QuestionStepEditor";
import LessonStepsList from "./LessonStepsList";

const LessonStepEditor = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const [steps, setSteps] = useState([]);
    const [originalSteps, setOriginalSteps] = useState([]);
    const [activeStepIndex, setActiveStepIndex] = useState(0);
    const [deletedStepIds, setDeletedStepIds] = useState([]);
    const axiosInstance = useAxios();

    useEffect(() => {
        fetchSteps();
    }, [courseId, moduleId, lessonId]);

    const fetchSteps = async () => {
        try {
            const response = await axiosInstance.get(
                `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`
            );
            setSteps(response.data);
            setOriginalSteps(JSON.parse(JSON.stringify(response.data))); // Deep copy for original state
        } catch (error) {
            console.error("Error fetching steps:", error);
        }
    };

    const handleSaveAllSteps = async () => {
        try {
            // Delete steps marked for deletion
            await Promise.all(
                deletedStepIds.map((id) =>
                    axiosInstance.delete(
                        `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${id}/`
                    )
                )
            );

            // Save updated and new steps
            await Promise.all(
                steps.map((step) => {
                    let content;
                    switch (step.step_type) {
                        case "text":
                            content = { html: step.content.html || "" };
                            break;
                        case "video":
                            content = { video_url: step.content.video_url || "" };
                            break;
                        case "question":
                            content = {
                                question: step.content.question || "",
                                answers: step.content.answers || [],
                                correct_answer: step.content.correct_answer || 0,
                            };
                            break;
                        default:
                            throw new Error("Invalid step type");
                    }

                    if (step.id.toString().startsWith("new")) {
                        // New step, use POST
                        return axiosInstance.post(
                            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/`,
                            {
                                step_type: step.step_type,
                                order: step.order,
                                content,
                                lesson: lessonId, // Ensure the lesson ID is included
                            }
                        );
                    } else {
                        // Existing step, use PATCH
                        return axiosInstance.patch(
                            `/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/steps/${step.id}/`,
                            {
                                step_type: step.step_type,
                                content,
                            }
                        );
                    }
                })
            );

            alert("Все шаги успешно сохранены!");
            setDeletedStepIds([]); // Clear deleted step IDs after save
            fetchSteps(); // Refresh steps from server
        } catch (error) {
            console.error("Error saving steps:", error);
        }
    };

    const updateStepContent = (index, content) => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            updatedSteps[index].content = content;
            return updatedSteps;
        });
    };

    const handleStepTypeChange = (index, stepType) => {
        setSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            updatedSteps[index].step_type = stepType;
            updatedSteps[index].content = getDefaultContent(stepType);
            return updatedSteps;
        });
    };

    const getDefaultContent = (stepType) => {
        switch (stepType) {
            case "text":
                return { html: "<p>text</p>" };
            case "video":
                return { video_url: "" };
            case "question":
                return { question: "", answers: [], correct_answer: 0 };
            default:
                return {};
        }
    };

    const handleCancel = () => {
        setSteps(JSON.parse(JSON.stringify(originalSteps))); // Revert to original steps
        setDeletedStepIds([]); // Clear marked deletions
    };

    const handleAddNewStep = () => {
        // Save the current step before adding a new one
        const currentContent = { ...steps[activeStepIndex].content };
        setSteps((prevSteps) => {
            const newStep = {
                id: `new-${prevSteps.length + 1}`, // Temporary ID for client-side use
                step_type: "text",
                order: prevSteps.length + 1,
                content: getDefaultContent("text"),
            };

            const updatedSteps = [...prevSteps, newStep];
            // Restore current step content
            updatedSteps[activeStepIndex].content = currentContent;
            return updatedSteps;
        });

        setActiveStepIndex(steps.length); // Move to the new step
    };

    const handleDeleteStep = (index) => {
        if (!steps[index].id.toString().startsWith("new")) {
            // Mark existing step for deletion
            setDeletedStepIds((prevIds) => [...prevIds, steps[index].id]);
        }
        setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index)); // Remove step from list
        setActiveStepIndex((prevIndex) => Math.max(0, prevIndex - 1)); // Adjust active step index
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Редактирование урока
            </Typography>

            <LessonStepsList
                steps={steps}
                activeStepIndex={activeStepIndex}
                onStepClick={setActiveStepIndex}
                onAddStep={handleAddNewStep}
            />
            <StepTypeSelector
                stepType={steps[activeStepIndex]?.step_type}
                setStepType={(newType) =>
                    handleStepTypeChange(activeStepIndex, newType)
                }
            />
            {steps[activeStepIndex]?.step_type === "text" && (
                <TextStepEditor
                    content={steps[activeStepIndex].content.html}
                    setContent={(html) => updateStepContent(activeStepIndex, { html })}
                />
            )}
            {steps[activeStepIndex]?.step_type === "video" && (
                <VideoStepEditor
                    content={steps[activeStepIndex].content.video_url}
                    setContent={(video_url) =>
                        updateStepContent(activeStepIndex, { video_url })
                    }
                />
            )}
            {steps[activeStepIndex]?.step_type === "question" && (
                <QuestionStepEditor
                    question={steps[activeStepIndex].content.question}
                    setQuestion={(question) =>
                        updateStepContent(activeStepIndex, {
                            ...steps[activeStepIndex].content,
                            question,
                        })
                    }
                    answers={steps[activeStepIndex].content.answers}
                    setAnswers={(answers) =>
                        updateStepContent(activeStepIndex, {
                            ...steps[activeStepIndex].content,
                            answers,
                        })
                    }
                    correctAnswerIndex={steps[activeStepIndex].content.correct_answer}
                    setCorrectAnswerIndex={(correct_answer) =>
                        updateStepContent(activeStepIndex, {
                            ...steps[activeStepIndex].content,
                            correct_answer,
                        })
                    }
                />
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, mt: 2, mb: 4 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteStep(activeStepIndex)}
                    disabled={steps.length === 0}
                >
                    Удалить шаг
                </Button>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button variant="text" color="secondary" onClick={handleCancel}>
                        Отмена
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveAllSteps}
                    >
                        Сохранить все шаги
                    </Button>
                </Box>
            </Box>

        </Container>
    );
};

export default LessonStepEditor;
