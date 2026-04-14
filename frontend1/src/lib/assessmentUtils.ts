export const getCompletedAssessmentsKey = (userId: number) => `completedAssessments_${userId}`;

export const REQUIRED_ASSESSMENTS = ['riasec', 'aptitude', 'personality', 'values', 'risk'] as const;

export const markAssessmentComplete = (userId: number, assessmentId: string) => {
    const storageKey = getCompletedAssessmentsKey(userId);
    const completed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!completed.includes(assessmentId)) {
        completed.push(assessmentId);
        localStorage.setItem(storageKey, JSON.stringify(completed));
    }
};

export const getCompletedAssessments = (userId: number): string[] => {
    const storageKey = getCompletedAssessmentsKey(userId);
    return JSON.parse(localStorage.getItem(storageKey) || '[]');
};

export const hasCompletedAllAssessments = (userId: number): boolean => {
    const completed = new Set(getCompletedAssessments(userId));
    return REQUIRED_ASSESSMENTS.every((assessmentId) => completed.has(assessmentId));
};
