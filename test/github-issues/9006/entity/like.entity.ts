import { Entity, ManyToOne, PrimaryGeneratedColumn } from "../../../../src"
import { Comment } from "./comment.entity"

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => Comment, (comment) => comment.likes)
    comment: Comment;
}
