

export function SetExample() {

    const mySet = new Set(["test1", "test2", "test1"]);
    mySet.add("test3");
    mySet.add("test2");
    console.log(Array.from(mySet).map(i => i + ";").sort((a, b) => a > b ? -1 : 1));


}