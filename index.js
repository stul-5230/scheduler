
class Scheduler {
    queue = [];
    limit = 2;

    add (promiseCreator) {
        return new Promise((resolve) => {
            promiseCreator.resolve = resolve;
            this.queue.push(promiseCreator);
            const size = Object.keys(this.queue).length;
            if (size <= this.limit) {
                this.run(promiseCreator);
            }
        })
    }

    run(promiseCreator) {
        promiseCreator().then(() => {
            promiseCreator.resolve();
            const p = this.queue.shift();
            p && this.run(p);
        })
    }

}

const timeout = time => new Promise((resolve) => setTimeout(resolve, time))

const scheduler = new Scheduler();

const addTask = (time, order) => {
    scheduler.add(() => timeout(time)).then(() => console.log(order))
}

addTask(1000, 1)
addTask(500, 2)
addTask(300, 3)
addTask(400, 4)