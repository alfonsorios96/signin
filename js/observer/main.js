(function () {
    class Observable {
        constructor() {
            this.handlers = [];
        }

        subscribe(_function) {
            this.handlers.push(_function);
        }

        unsubscribe(_function) {
            this.handlers = this.handlers.filter(item => {
                if (item !== _function) {
                    return item;
                }
            });
        }

        fire(o, thisObject) {
            let scope = thisObject || window;
            this.handlers.forEach(item => {
                item.call(scope, o);
            })
        }
    }

    const inputs = document.getElementsByClassName('observable');

    (function () {
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keyup', () => {
                const clickHandler = (item) => {
                    const newNode = document.createElement('p');
                    const newContent = document.createTextNode(item);
                    const containers = document.getElementsByClassName('container-binding');
                    newNode.appendChild(newContent);
                    for (let i = 0; i < containers.length; i++) {
                        containers[i].innerHTML = '';
                        containers[i].appendChild(newNode);
                    }
                };

                const subject = new Observable();
                subject.subscribe(clickHandler);
                subject.fire(event.target.value, this);
                subject.unsubscribe(clickHandler);
            });
        }
    })();
})();
