module.exports = async function () {
    this.before('CREATE', 'Files', req => {
        console.log('Create called')
        console.log(JSON.stringify(req.data))
        req.data.url = `/odata/v2/catalog/Files(${req.data.ID})/content`
    })
}