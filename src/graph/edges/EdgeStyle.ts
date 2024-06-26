import { Arrow, DefaultGraph, INode, PolylineEdgeStyle } from 'yfiles'
import { Game } from '../../types/Game'
import { BIDIRECTIONAL } from './Bidirectional'

const maxEdgeThickness: number = 10

export function applyEdgeStyle(graph: DefaultGraph) {
  console.log(graph.ports.size)
  for (const edge of graph.edges.toList()) {
    const node = edge.sourceNode
    const likedNode = edge.targetNode
    if (!node || !likedNode) continue
    const similarity: number = calculateSimilarity(node, likedNode)
    const thickness: number = Math.max(Math.ceil((1 / similarity) * maxEdgeThickness), 4)
    const polyOptions = {
      stroke: edge.tag === BIDIRECTIONAL ? thickness.toString() + 'px dashed #236671' : thickness.toString() + 'px dashed #236671',
      targetArrow: new Arrow({
        fill: edge.tag === BIDIRECTIONAL ? '#236671' : '#236671',
        scale: thickness / 2,
        type: 'short'
      }),
      sourceArrow: edge.tag === BIDIRECTIONAL ? new Arrow({
        fill: '#236671',
        scale: thickness / 2,
        type: 'short'
      }) : undefined
    }
    graph.createEdge(node, likedNode, new PolylineEdgeStyle(polyOptions), edge.tag)
    graph.remove(edge)
  }
}

function calculateSimilarity(sourceNode: INode, targetNode: INode) {
  const sourceGame = sourceNode.tag as Game
  const targetGame = targetNode.tag as Game
  if (!sourceGame || !targetGame) return 0
  let similarity_counter: number = 1
  for (const sourceCategory of sourceGame.types.categories) {
    for (const targetCategory of targetGame.types.categories) {
      if (sourceCategory.id === targetCategory.id) {
        similarity_counter++
        break
      }
    }
  }
  return similarity_counter
}
