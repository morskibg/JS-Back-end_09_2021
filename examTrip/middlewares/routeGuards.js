// ADD OWNERONLY IF NEEDED. AND OTHERS. IF NEEDED
// FIX GUEST ONLY
module.exports = {
	usersOnly: (req, res, next) => req.user ? next() : res.redirect('/user/login'),
	guestsOnly: (req, res, next) => !req.user ? next() : res.redirect('/'),
	ownerOnly: async (req, res, next) => {
		const custom = await req.dbServices.custom.getById(req.params.id)

		custom.creator.equals(req.user._id) ? next() : res.redirect('/')
	},
	notOwnerOnly: async (req, res, next) => {
		const custom = await req.dbServices.custom.getById(req.params.id)

		!custom.creator.equals(req.user._id) ? next() : res.redirect('/')
	},
}