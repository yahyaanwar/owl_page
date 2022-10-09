# -*- coding: utf-8 -*-

# from odoo import models, fields, api


# class owl_page(models.Model):
#     _name = 'owl_page.owl_page'
#     _description = 'owl_page.owl_page'

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
