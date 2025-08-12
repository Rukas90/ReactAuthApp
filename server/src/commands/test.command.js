
const COMMAND_NAME = 'TEST_COMMAND'

export const TestDispatch = (value) => {
    return {
        command: COMMAND_NAME,
        payload: {
            value: value
        }
    }
}
export const TestCommand = [COMMAND_NAME, async (context) => {
    context.req.test = context.payload.value
}]