export default interface RepositoryInterface<T>{
    create(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    find(id: string): Promise<T>;
    findAll(): Promise<T[]>;
}

interface FindRepositoryInterface<T>{
    create(entity: T): Promise<void>;
    find(id: string): Promise<T>;
}


export {
    RepositoryInterface,
    FindRepositoryInterface
}