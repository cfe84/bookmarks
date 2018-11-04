interface IUserStorageProvider {
    setUserIdAsync(systemUserId: string, userId: string): Promise<void>;
    getUserIdAsync(systemUserId: string): Promise<string>;
}

export { IUserStorageProvider }