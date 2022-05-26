const { expect } = require('chai');
const Scheduler = require('../index')

describe("Scheduler", function() {
    
    const timeout = time => new Promise((resolve) => setTimeout(resolve, time))
    
    it('task number more than limit, limited number of tasks will be executed', async function() {
        const results = [];
        const scheduler = new Scheduler(2);
        const addTask = (time, order) => {
            scheduler.add(() => timeout(time)).then(() => {
                results.push(order);
            })
        }

        await (
            () => new Promise((resolve) => {
                addTask(100, 1)
                addTask(50, 2)
                addTask(30, 3)
                addTask(40, 4)
                setTimeout(() => { resolve() }, 300);
            })
        )();

        expect(results).to.deep.equal([2,3,1,4]);
    })

    
    it('task number is equal or greater to limit, the faster task will resolve eariler', async function() {
        const results = [];
        const scheduler = new Scheduler(5);
        const addTask = (time, order) => {
            scheduler.add(() => timeout(time)).then(() => {
                results.push(order);
            })
        }

        await (
            () => new Promise((resolve) => {
                addTask(100, 1)
                addTask(50, 2)
                addTask(30, 3)
                addTask(10, 4)
                setTimeout(() => { resolve() }, 300);
            })
        )();

        expect(results).to.deep.equal([4, 3, 2, 1]);
    })


    it('when limit value is 1, task will execute in serial', async function() {
        const results = [];
        const scheduler = new Scheduler(1);
        const addTask = (time, order) => {
            scheduler.add(() => timeout(time)).then(() => {
                results.push(order);
            })
        }

        await (
            () => new Promise((resolve) => {
                addTask(100, 1)
                addTask(50, 2)
                addTask(80, 3)
                addTask(10, 4)
                setTimeout(() => { resolve() }, 500);
            })
        )();

        expect(results).to.deep.equal([1,2,3,4]);
    })

    /**
     * argument test ⬇️
     * 
     */

    it('when the limit is empty, run code will throw an error', async function() {
        expect(()=>{new Scheduler()}).to.throw();
    })

    it('when the limit is not positive number, run code will throw an error(1/3)', async function() {
        expect(()=>{new Scheduler(-1)}).to.throw();
    })

    it('when the limit is not positive number, run code will throw an error(2/3)', async function() {
        expect(()=>{new Scheduler(0)}).to.throw();
    })

    it('when the limit is not positive number, run code will throw an error(3/3)', async function() {
        expect(()=>{new Scheduler('s')}).to.throw();
    })

})