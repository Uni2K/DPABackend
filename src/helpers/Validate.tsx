export async function validateSchema(schema, req, res) {

    const error = await schema.validate(req);
    if (error.error) {
       console.log(error.error)
       res.status(422).json(error.error.details[0].message);
    }
}
export { validateSchema as validate }
