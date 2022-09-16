import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "../../../../src"
import { Post } from "./post.entity"
import { Like } from "./like.entity"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @OneToMany(() => Like, (like) => like.comment, {
        eager: true,
        cascade: true,
    })
    likes: Like[];

    @ManyToOne(() => Post, (post) => post.comments)
    post: Post;
}
