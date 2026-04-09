//

chrome.commands.onCommand.addListener( ( command ) => {
    if( command == "forced-close"){
        chrome.tabs.query( { active: true, currentWindow: true }, ( tabs ) => {
            if( ! tabs[0] ) return;

            const tid = tabs[0].id;
            chrome.scripting.executeScript( {
                target: { tabId: tid },
                func: () => {
                    if(
                        ! ( document.fullscreenElement ) &&
                        ! ( window.innerHeight >= window.screen.height * 0.90 )
                    ) return;

                    window.onbeforeunload = undefined;
                    if( document.body ) document.body.onbeforeunload = undefined;
                    window.addEventListener( "beforeunload", ( e ) => {
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                    }, true );
                    
                    const style = document.createElement( "style" );
                    style.textContent = `
                        html {
                            color: #444 !important;
                            background: #fff !important;
                        }
                        html > * {
                            display: none !important;
                        }
                        html::before {
                            content: "ぼたもちおいしいよはやくたべなさい";
                            display: block !important;
                            position: fixed;
                            top: 5%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            font-family: monospace;
                            font-size: 2rem;
                            z-index: 2147483647;
                        }
                    `;
                    document.documentElement.appendChild( style );
                }
            } ).then( () => {
                chrome.tabs.remove( tid );
            } ).catch( ( e ) => {
                chrome.tabs.remove( tid );
            } );
        } );
    }
} );
