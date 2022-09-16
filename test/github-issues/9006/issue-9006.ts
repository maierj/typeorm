import "reflect-metadata"
import {
    createTestingConnections,
    closeTestingConnections,
    reloadTestingDatabases,
} from "../../utils/test-utils"
import { DataSource } from "../../../src"
import { Post } from "./entity/post.entity"
import { Comment } from "./entity/comment.entity"
import { Like } from "./entity/like.entity"
import { expect } from "chai"

describe.only("github issues > #9006 Eager relations do not respect relationLoadStrategy", () => {
    let dataSources: DataSource[]
    before(
        async () =>
            (dataSources = await createTestingConnections({
                entities: [__dirname + "/entity/*{.js,.ts}"],
                schemaCreate: true,
                dropSchema: true,
            })),
    )
    beforeEach(() => reloadTestingDatabases(dataSources))
    after(() => closeTestingConnections(dataSources))

    it("should load eager relation in separate query", async () => {
        for (const dataSource of dataSources) {
            const postRepository = await dataSource.getRepository(Post)
            const post = new Post()
            const comment = new Comment()
            const like = new Like();

            comment.likes = [like];
            post.comments = [comment]

            await postRepository.save(post)

            const queryBuilder = postRepository
                .createQueryBuilder()
                .setFindOptions({ relationLoadStrategy: "query" })

            const query = queryBuilder.getSql()

            const loadedPost = await queryBuilder.getMany()

            console.log(loadedPost);

            expect(query).to.not.contain("LEFT JOIN")
            expect(loadedPost).to.deep.equal([{ id: 1, comments: [{ id: 1, likes: [{ id: 1 }] }] }])
        }
    })
})
