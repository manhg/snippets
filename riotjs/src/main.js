import riot from 'riot';
import 'riot-hot-reload';

import './app.tag';

riot.mount(document.body, 'x-app', {
    title: 'RiotJS',
    options: [
        'hotload',
        'es6',
    ]
});
