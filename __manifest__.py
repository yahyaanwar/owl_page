# -*- coding: utf-8 -*-
{
    'name': "owl_page",

    'summary': """
        Short (1 phrase/line) summary of the module's purpose, used as
        subtitle on modules listing or apps.openerp.com""",

    'description': """
        Long description of module's purpose
    """,

    'author': "My Company",
    'website': "http://www.yourcompany.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/15.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'web'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
    'assets': {
        'web.assets_qweb': [
            '/owl_page/static/src/components/main.xml',
        ],
        'owl_page.style': [
            ('include', 'web.assets_frontend'),
            '/owl_page/static/src/components/main.scss',
        ],
        'owl_page.script': [
            '/web/static/lib/owl/owl.js',
            '/owl_page/static/src/components/main.js',
        ]
    }
}
