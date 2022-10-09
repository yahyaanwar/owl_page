# -*- coding: utf-8 -*-
from odoo.http import Controller, request, route


class OwlPage(Controller):
    @route(['/owl_page', '/owl_page/<int(min=1,max=4):page>'], type='http', auth="public", website=True, csrf=False)
    def main(self, **kwargs):
        if not request.session.uid:
            request.uid = request.env.ref('base.public_user').id
        else:
            request.uid = request.session.uid
        print(request.uid)
        return request.render('owl_page.main', {'lang': request.env.user.lang})
