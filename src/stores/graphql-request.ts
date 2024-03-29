import { DocumentNode, print } from 'graphql'
import { api } from 'src/boot/axios'

export default async (query: DocumentNode, variables?: unknown) =>
  new Promise<unknown>((resolve, reject) => {
    api({
      url: '',
      method: 'post',
      data: {
        query: print(query),
        variables
      }
    })
      .then((res) => res.data?.errors?.length ? reject(res.data.errors) : resolve(res.data.data))
      .catch((ex) => reject(ex))
  })
