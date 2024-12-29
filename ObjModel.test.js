import React from 'react'
import { render, act } from '@testing-library/react'
import { ObjModel } from './ObjModel'
import * as Three from 'three'

// Mock the useThree hook
jest.mock('@react-three/fiber', () => ({
  useThree: () => ({
    scene: {
      add: jest.fn(),
      remove: jest.fn(),
      children: [],
    },
  }),
}))

// Mock the MTLLoader and OBJLoader
jest.mock('three/examples/jsm/loaders/MTLLoader.js', () => ({
  MTLLoader: jest.fn().mockImplementation(() => ({
    loadAsync: jest.fn().mockResolvedValue({}),
    setPath: jest.fn(),
  })),
}))

jest.mock('three/examples/jsm/loaders/OBJLoader.js', () => ({
  OBJLoader: jest.fn().mockImplementation(() => ({
    loadAsync: jest.fn().mockResolvedValue({
      traverse: jest.fn(),
      scale: { set: jest.fn() },
      position: { sub: jest.fn() },
      quaternion: { normalize: jest.fn() },
    }),
    setMaterials: jest.fn(),
    setPath: jest.fn(),
  })),
}))

describe('ObjModel', () => {
  it('loads the model and calls the appropriate callbacks', async () => {
    const setModelOrientation = jest.fn()
    const setModelLoaded = jest.fn()
    const setLoadingProgress = jest.fn()

    const model = {
      mtlFile: 'test.mtl',
      objFile: 'test.obj',
    }

    await act(async () => {
      render(
        <ObjModel
          setModelOrientation={setModelOrientation}
          setModelLoaded={setModelLoaded}
          setLoadingProgress={setLoadingProgress}
          model={model}
        />
      )
    })

    expect(setModelOrientation).toHaveBeenCalled()
    expect(setModelLoaded).toHaveBeenCalledWith(true)
    expect(setLoadingProgress).toHaveBeenCalledWith(100)
  })

  // Add more tests as needed
})
