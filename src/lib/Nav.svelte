<script lang='ts'>
    import { user as userStore } from './stores.js';
    import { supabase } from './supabase.js';
    function goto(url: string) {
        window.location.href = url;
    }

    /*
        Loading user info
        1. Subscribe for user info
        2. If no pfp then generate one
        3. Check for user row on table and add username if needed
    */

    let profileSrc = '';
    let name = '';

    async function createUser(uid: string) {
        let username = '';
        while(username.length < 4) {
            username = prompt('Username (minimum 4 characters)');
        }
        const res = await supabase.from('users').insert({id: uid, name: username });

        if(res.status.toString().startsWith('20')) {
            alert('Failed to setup user');
        }
    }

    async function setUsername(uid: string) {
        const res = await supabase.from('users').select('*').eq('id', uid);
        
        if(res.status.toString().startsWith('20')) {
            if(res.body.length < 1) {
                await createUser(uid);
                await setUsername(uid);
            }else {
                name = res.body[0].name;
            }
        }
    }

    userStore.subscribe(user => {
        if(user) {
            const avatar = user['user_metadata']['avatar_url'];
            profileSrc = avatar ? avatar : '';
            
            setUsername(user['id']);
        }
    })

    fetch('https://randomuser.me/api/?inc=picture&lego').then(async val => {
        const data = await val.json();

        if(profileSrc == '') profileSrc = data['results'][0]['picture']['thumbnail']
    });
</script>

<nav>
    <button on:click={() => goto('/')}>Home</button>

    <p>{name}</p>
    <img src={profileSrc} alt="profile">
</nav>

<style>
    nav {
        display: flex;
        flex-direction: row;
        width: 100%;

        border-bottom: 1px gray solid;
        margin-bottom: 10px;

        --height: 48px;

        height: var(--height);
        max-height: var(--height);

        align-items: center;

        user-select: none;
    }

    p {
        margin: 0px;
        margin-left: auto;
        margin-right: 5px;
    }

    img {
        height: var(--height);
        max-height: var(--height);

        border-radius: 50%;
    }
</style>