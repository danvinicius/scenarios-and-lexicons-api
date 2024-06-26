import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { IEpisode, IRestriction } from '@/entities';
import { IScenario } from '@/entities';
import { Scenario } from './Scenario';
import { Restriction } from './Restriction';

@Entity()
export class Episode implements IEpisode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  position: number;

  @Column()
  description: string;

  @Column()
  type: string;

  @OneToOne(() => Restriction, (restriction) => restriction.episode)
  @JoinColumn({
    name: 'restriction_id'
  })
  restriction: IRestriction;

  @ManyToOne(() => Scenario, (scenario) => scenario.episodes)
  @JoinColumn({
    name: 'scenario_id'
  })
  scenario: IScenario;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
