export type UrlObject = {
  redirect_url: string,
  shortened_url: string,
  slug: string,
  expiration_date?: number
}

export type UrlReturnType = {
  id: string,
  created_at: number
} & UrlObject