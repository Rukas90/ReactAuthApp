import { TestDispatch }       from '#commands/test.command.js'
import { createVerification } from '#controllers/verification.controller.js'
import { generateRandomCode } from '#utils/random.util.js'

export const registerTestRoutes = (server) => {

    server.app.get('/test/value', (req, res) => {
        res.status(200).json({ value: req.test })
    })
    server.app.post('/verifications', async (req, res) => {
        const userID = '1aa6915a-4fd0-42cb-a60d-78e2b04eb220'
        await createVerification(userID, 'Test', TestDispatch(generateRandomCode()), 0.2, 5, 'rukas.skirkevicius@gmail.com', true, 'Test activation')
    })
}