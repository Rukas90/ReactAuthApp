const clear_code = (req, key) => {
    delete req.session[key]
    req.session.save()
}