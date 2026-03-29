import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import UserForm from './UserForm.vue'

describe('UserForm', () => {
  it('emits submit when form is valid', async () => {
    const wrapper = mount(UserForm)

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('Alice')
    await inputs[1].setValue('alice@example.com')

    await wrapper.find('form').trigger('submit.prevent')

    const submitEvents = wrapper.emitted('submit')
    expect(submitEvents).toBeTruthy()
    expect(submitEvents?.[0][0]).toEqual({
      name: 'Alice',
      email: 'alice@example.com',
      role: 'student',
    })
  })
})
