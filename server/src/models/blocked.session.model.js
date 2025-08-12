export const getNewBlockedSession = (sessionID, reason, blockDuration) => {
    const date = new Date()

    return {
        session_id:       sessionID,
        block_reason:     reason,
        block_start_time: date,
        block_duration:   blockDuration,
        block_end_time:   new Date(date.getTime() + blockDuration * 1000)
    }
}