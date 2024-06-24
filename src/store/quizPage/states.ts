export default interface States {
    quiz: Quiz | null | undefined;
    submit_state: boolean;
    auto_submit_state: boolean;
    error_message: string | undefined;
}
