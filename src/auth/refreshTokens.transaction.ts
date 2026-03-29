import { DataSource } from "typeorm";
import CreateTokenDto from "./dtos/CreateTokenDto";
import IRefreshTokensTransaction from "./interfaces/IRefreshTokensTransaction";
import Token from "./entities/Token";



class RefreshTokensTransaction implements IRefreshTokensTransaction {
    public constructor({dataSource}: {dataSource: DataSource}) {
        this.dataSource = dataSource; 
    }

    public async execute(userId: number, tokens: Array<CreateTokenDto>): Promise<void> {
        const newTokens: Array<CreateTokenDto> = []; 

        tokens.forEach(token => {
            const newToken = new Token();
            newToken.token = token.token;
            newToken.type = token.type;
            newToken.uuid = token.uuid;
            newToken.userId = token.userId;

            newTokens.push(newToken);
        });

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.createQueryBuilder()
                .delete()
                .from(Token)
                .where("userId = :userId", { userId: userId })
                .execute();
            await queryRunner.manager.save(newTokens);

            await queryRunner.commitTransaction();
            
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    };

    private dataSource: DataSource;
}

export default RefreshTokensTransaction;