import { IObject } from "../shared/IObject";

export class ObjectContainer {
        objects: IObject[];

        constructor(objects?: (IObject | string)[]) {
                this.objects = [];
                if (objects) {
                        for (const obj of objects) {
                                if (typeof obj === "string") {
                                        this.objects.push(new IObject(obj));
                                } else {
                                        this.objects.push(obj);
                                }
                        }
                }
        }

        forEach(callback: (obj: IObject) => void): void {
                for (const obj of this.objects) {
                        callback(obj);
                }
        }

        add(obj: IObject): ObjectContainer {
                this.objects.push(obj);
                return this;
        }

        addMany(objs: IObject[]): ObjectContainer {
                for (const obj of objs) {
                        this.objects.push(obj);
                }
                return this;
        }

        removeByName(name: string): void {
                for (let i = this.objects.length - 1; i >= 0; i -= 1) {
                        if (this.objects[i].path.name() === name) {
                                this.objects.splice(i, 1);
                                return;
                        }
                }
        }

        disableAll(): void {
                this.forEach((obj) => obj.disable());
        }

        enableAll(): ObjectContainer {
                this.forEach((obj) => obj.enable());
                return this;
        }

        deleteAll(): void {
                this.forEach((obj) => obj.delete(true));
        }

        map(fn: (obj: IObject) => unknown): unknown[] {
                const results: unknown[] = [];
                this.forEach((obj) => results.push(fn(obj)));
                return results;
        }
}
