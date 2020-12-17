import Vue from 'vue'
import Router from 'vue-router'
import LoginContainer from '@/components/LoginContainer'
import BaseContainer from '@/components/BaseContainer'
import HomeInfo from '@/components/HomeInfo'
import HomeContainer from '@/components/HomeContainer'
import MapContainer from '@/components/MapContainer'
import TestContainer from '@/components/TestContainer'
import TestVideo from '@/components/TestVideo'
import CallSimulator from '@/components/simulator/CallSimulator'

// 自动点播 对外提供的
import BaseContainerPlay from '@/components/automaticPlay/BaseContainer'
import HomeContainerPlay from '@/components/automaticPlay/HomeContainer'
import PwdLogin2 from '@/components/automaticPlay/PwdLogin'


import MonitoringLogin from '@/components/monitoring/PwdLogin'
// import Monitor from '@/components/home/Monitor'
import BaseContainerMonitor from '@/components/monitoring/BaseContainer'
import HomeContainerMonitor from '@/components/monitoring/HomeContainer'

Vue.use(Router)

export default new Router({
    routes: [{
            path: '/',
            //name: 'LoginContainer',
            component: LoginContainer
        },
        {
            path: '/Login',
            name: 'LoginContainer',
            component: LoginContainer
        },
        {
            path: '/Login2',
            name: 'LoginContainer2',
            component: PwdLogin2
        },
        // {
        //     path: '/Play',
        //     name: 'Play',
        //     component: AutomaticPlay,
        //     // component: AutomaticPlay,
        //     // children: [
        //     //     {
        //     //         path: 'AutomaticPlay',
        //     //         name: 'AutomaticPlay',
        //     //         component: AutomaticPlay,
        //     //     }
        //     // ]
        // },
        {
            path: '/Play',
            name: 'Play',
            component: BaseContainerPlay,
            // component: AutomaticPlayMixins,
            // component: AutomaticPlay,
            children: [
                {
                    path: 'AutomaticPlay',
                    name: 'AutomaticPlay',
                    // component: AutomaticPlay,
                    component: HomeContainerPlay,
                }
            ]
        },
        {
            path: '/MonitoringLogin',
            name: 'MonitoringLogin',
            component: MonitoringLogin
        },
        {
            path: '/MonitorHome',
            name: 'MonitorHome',
            component: BaseContainerMonitor,
            children: [
                {
                    path: 'VideoMonitor',
                    name: 'VideoMonitor',
                    component: HomeContainerMonitor,
                }
            ]
        },
        {
            path: '/Home',
            component: BaseContainer,
            children: [
                // {
                //     path: '/',
                //     name: 'HomeContainer',
                //     component: HomeContainer,
                // },
                {
                    path: '/',
                    name: 'HomeInfo',
                    component: HomeInfo,
                }
            ]
        },
        {
            path: '/Map',
            component: BaseContainer,
            children: [
                {
                    path: '/',
                    name: 'MapContainer',
                    component: MapContainer,
                }
            ]
        },
        {
            path: '/Test',
            name: 'TestContainer',
            component: TestContainer
        },
        {
            path: '/TestVideo',
            name: 'TestVideo',
            component: TestVideo
        },
        {
            path: '/Simulator',
            name: 'CallSimulator',
            component: CallSimulator
        }
    ]
})