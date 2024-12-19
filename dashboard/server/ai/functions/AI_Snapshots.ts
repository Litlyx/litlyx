
import { AIPlugin } from "../Plugin";
import { ProjectModel } from "@schema/project/ProjectSchema";
import { ProjectSnapshotModel } from "@schema/project/ProjectSnapshot";

export class AiSnapshot extends AIPlugin<[
    'getSnapshots',
    'createSnapshot',
]> {

    constructor() {
        super({

            'getSnapshots': {
                handler: async (data: { project_id: string }) => {
                    const snapshots = await ProjectSnapshotModel.find({ project_id: data.project_id });
                    return snapshots.map(e => e.toJSON());
                },
                tool: {
                    type: 'function',
                    function: {
                        name: 'getSnapshots',
                        description: 'Gets the snapshots list',
                        parameters: {}
                    }
                }
            },

            'createSnapshot': {
                handler: async (data: { project_id: string, from: string, to: string, color: string, name: string }) => {

                    if (!data.name) return { error: 'SnapshotName too short' }
                    if (data.name.length == 0) return { error: 'SnapshotName too short' }

                    if (!data.from) return { error: 'from is required' }
                    if (!data.to) return { error: 'to is required' }
                    if (!data.color) return { error: 'color is required' }

                    const project = await ProjectModel.findById(data.project_id);
                    if (!project) return { error: 'Project not found' }


                    const newSnapshot = await ProjectSnapshotModel.create({
                        name: data.name,
                        from: new Date(data.from),
                        to: new Date(data.to),
                        color: data.color,
                        project_id: data.project_id
                    });

                    return newSnapshot.id;


                },
                tool: {
                    type: 'function',
                    function: {
                        name: 'createSnapshot',
                        description: 'Create a snapshot',
                        parameters: {
                            type: 'object',
                            properties: {
                                from: { type: 'string', description: 'ISO string of start date' },
                                to: { type: 'string', description: 'ISO string of end date' },
                                color: { type: 'string', description: 'Color of the snapshot in HEX' },
                                name: { type: 'string', description: 'Name of the snapshot' }
                            },
                            required: ['from', 'to', 'color', 'name']
                        }
                    }
                }
            },

        })
    }
}

export const AiSnapshotInstance = new AiSnapshot();