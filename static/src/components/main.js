/** @odoo-module **/

import rpc from 'web.rpc';
// import utils from 'web.utils';
// import weUtils from 'web_editor.utils';
// import { set_cookie, get_cookie } from 'web.utils.cookies';
import session from 'web.session';
import {_t, _lt} from 'web.core';

const {Component, Store, mount, QWeb, useState} = owl;
const {useDispatch, useStore, useGetters, useRef, onWillStart } = owl.hooks;
const {Router, RouteComponent, Link} = owl.router;
const {whenReady, loadFile} = owl.utils;

const SESSION_STORAGE_ITEM_NAME = 'owlPageSessionStore';

class MainScreen extends Component {
    constructor() {
        super(...arguments);
        this.can_navigate = useStore((state) => state.is_can_navigate);
        this.dispatch = useDispatch();
        this.getters = useGetters();
    }

    setup() {
        super.setup();
        this.state = useState({
            'user_name': '',
        });

        onWillStart(async () => {
            if (session.user_id) {
                try {
                    const user = await rpc.query({
                        model: 'res.partner',
                        method: 'read',
                        args: [7],
                        kwargs: {
                            'fields': ['display_name']
                        },
                    });
                    if (user.length === 1) {
                        this.state.user_name = user[0].display_name;
                    }
                } catch (e) {
                    console.error(e);
                }
            }
        })
    }
}
Object.assign(MainScreen, {
    components: {Link},
    template: 'owl_page.Main',
});

class SubScreen extends Component {
    constructor() {
        super(...arguments);
        this.can_navigate = useStore((state) => state.is_can_navigate);
        this.dispatch = useDispatch();
        this.getters = useGetters();
    }

    gotoMain() {
        this.env.router.navigate({to: 'MAIN'});
    }
}
Object.assign(SubScreen, {
    components: {},
    template: 'owl_page.Sub',
});

class App extends Component {}
Object.assign(App, {
    components: {RouteComponent},
    template: 'owl_page.App',
});

async function protectRoute({ env, from, to }) {
    if (from === null) {
        return { to: "DEFAULT" };
    }
    return env.store.getters.getCanNavigate();
}

const ROUTES = [
    {name: 'DEFAULT', path: '/owl_page', component: MainScreen},
    {name: 'MAIN', path: '/owl_page/1', component: MainScreen, beforeRouteEnter: protectRoute},
    {name: 'SUB', path: '/owl_page/2', component: SubScreen, beforeRouteEnter: protectRoute},
];

const getters = {
    getCanNavigate({state}) {
        return state.is_can_navigate;
    },
}

const actions = {
    toggleCanNavigate({state}) {
        state.is_can_navigate = !state.is_can_navigate;
    },
    setCanNavigate({state}, can_navigate) {
        state.is_can_navigate = can_navigate;
    }
}

async function getInitialState() {
    const state = {
        'is_can_navigate': true,
    }
    try {
        const user = await rpc.query({
            model: 'res.partner',
            method: 'read',
            args: [7],
            kwargs: {
                'fields': ['display_name']
            },
        });
        if (user.length === 1) {
            state.user_name = user[0].display_name;
        }
    } catch (e) {
        console.error(e);
    }
    const localState = JSON.parse(window.sessionStorage.getItem(SESSION_STORAGE_ITEM_NAME));
    if (localState) {
        return localState;
    }
    return state;
}

async function makeEnvironment() {
    const services = Component.env.services;
    const state = await getInitialState(services);
    const store = new Store({state, actions, getters});
    store.on("update", null, () => {
        const newState = {
            is_can_navigate: store.state.is_can_navigate,
        };
        window.sessionStorage.setItem(SESSION_STORAGE_ITEM_NAME, JSON.stringify(newState));
    });
    await session.is_bound;
    const qweb = new QWeb({translateFn: _t});
    const configuratorTemplates = await loadFile('/owl_page/static/src/components/main.xml');
    qweb.addTemplates(configuratorTemplates);
    const env = {store, services, qweb};
    const router = new Router(env, ROUTES);
    await router.start();
    return Object.assign(env, {router});
}

async function setup() {
    const env = await makeEnvironment();
    await mount(App, {target: document.body, env});
}

whenReady(setup).then(console.log).catch(console.error);