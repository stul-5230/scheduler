
class Scheduler {
    queue = [];
    limit = 0;
    working = 0;

    constructor(limit) {
        if (typeof limit !== 'number' || (Math.floor(limit) <= 0)) {
            throw new TypeError('limit must be a positive number')
        }
        this.limit = limit;
    }

    add (promiseCreator) {
        return new Promise((resolve) => {
            promiseCreator.resolve = resolve;
            this.queue.push(promiseCreator);
            this.run();
        })
    }

    run() {
        if (this.working < this.limit) {
            this.working++;
            const task = this.queue.shift();
            task && task().then(() => {
                this.working--;
                task.resolve();
                this.run();
            })
        }
    }

}

module.exports = Scheduler;